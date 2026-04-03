import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());
const BATCH_SIZE = 25;
const TOTAL_USERS = 10000;
const PASSWORD = "password";
const IMAGE_URL =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function batchWriteWithRetry(
  tableName: string,
  items: any[],
  maxRetries = 5
) {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const result = await client.send(
          new BatchWriteCommand({
            RequestItems: { [tableName]: batch },
          })
        );
        // Handle unprocessed items
        const unprocessed = result.UnprocessedItems?.[tableName];
        if (unprocessed && unprocessed.length > 0) {
          await sleep(100 * Math.pow(2, retries));
          retries++;
          continue;
        }
        break;
      } catch (e: any) {
        if (
          e.name === "ProvisionedThroughputExceededException" &&
          retries < maxRetries - 1
        ) {
          await sleep(200 * Math.pow(2, retries));
          retries++;
        } else {
          throw e;
        }
      }
    }
    // Small delay between batches to avoid throttling
    if (i % 250 === 0 && i > 0) {
      await sleep(100);
    }
  }
}

async function populateUsers() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(PASSWORD, salt);

  // Check how many users already exist by testing a sample
  console.log("Checking existing data...");

  console.log(`Creating ${TOTAL_USERS} users...`);

  const userItems = [];
  for (let j = 0; j < TOTAL_USERS; j++) {
    const alias = `@user${j.toString().padStart(5, "0")}`;
    userItems.push({
      PutRequest: {
        Item: {
          alias,
          firstName: `First${j}`,
          lastName: `Last${j}`,
          passwordHash,
          imageUrl: IMAGE_URL,
        },
      },
    });
  }

  // Write users in batches
  for (let i = 0; i < userItems.length; i += BATCH_SIZE) {
    const batch = userItems.slice(i, i + BATCH_SIZE);
    let retries = 0;
    while (retries < 5) {
      try {
        await client.send(
          new BatchWriteCommand({
            RequestItems: { "tweeter-users": batch },
          })
        );
        break;
      } catch (e: any) {
        if (e.name === "ProvisionedThroughputExceededException") {
          await sleep(500 * Math.pow(2, retries));
          retries++;
        } else {
          throw e;
        }
      }
    }
    if ((i + BATCH_SIZE) % 1000 === 0) {
      console.log(`  Created ${Math.min(i + BATCH_SIZE, TOTAL_USERS)} users`);
      await sleep(200);
    }
  }

  console.log("Users created.");

  // Create main test user
  const mainAlias = "@mainuser";
  await client.send(
    new BatchWriteCommand({
      RequestItems: {
        "tweeter-users": [
          {
            PutRequest: {
              Item: {
                alias: mainAlias,
                firstName: "Main",
                lastName: "User",
                passwordHash,
                imageUrl: IMAGE_URL,
              },
            },
          },
        ],
      },
    })
  );
  console.log("Main user created: @mainuser");

  // Create follow relationships
  console.log("Creating 10K follow relationships...");
  const followItems = [];
  for (let j = 0; j < TOTAL_USERS; j++) {
    const followerAlias = `@user${j.toString().padStart(5, "0")}`;
    followItems.push({
      PutRequest: {
        Item: {
          follower_handle: followerAlias,
          followee_handle: mainAlias,
        },
      },
    });
  }

  for (let i = 0; i < followItems.length; i += BATCH_SIZE) {
    const batch = followItems.slice(i, i + BATCH_SIZE);
    let retries = 0;
    while (retries < 5) {
      try {
        await client.send(
          new BatchWriteCommand({
            RequestItems: { "tweeter-follows": batch },
          })
        );
        break;
      } catch (e: any) {
        if (e.name === "ProvisionedThroughputExceededException") {
          await sleep(500 * Math.pow(2, retries));
          retries++;
        } else {
          throw e;
        }
      }
    }
    if ((i + BATCH_SIZE) % 1000 === 0) {
      console.log(
        `  Created ${Math.min(i + BATCH_SIZE, TOTAL_USERS)} follows`
      );
      await sleep(200);
    }
  }

  // Set follow counts
  console.log("Setting follow counts...");
  await client.send(
    new UpdateCommand({
      TableName: "tweeter-follow-counts",
      Key: { alias: mainAlias },
      UpdateExpression: "SET follower_count = :fc, followee_count = :fec",
      ExpressionAttributeValues: {
        ":fc": TOTAL_USERS,
        ":fec": 0,
      },
    })
  );

  // Set followee counts for users in batches
  for (let i = 0; i < TOTAL_USERS; i += 25) {
    const end = Math.min(i + 25, TOTAL_USERS);
    const promises = [];
    for (let j = i; j < end; j++) {
      const alias = `@user${j.toString().padStart(5, "0")}`;
      promises.push(
        client
          .send(
            new UpdateCommand({
              TableName: "tweeter-follow-counts",
              Key: { alias },
              UpdateExpression:
                "SET followee_count = :one, follower_count = if_not_exists(follower_count, :zero)",
              ExpressionAttributeValues: {
                ":zero": 0,
                ":one": 1,
              },
            })
          )
          .catch(async (e: any) => {
            if (e.name === "ProvisionedThroughputExceededException") {
              await sleep(1000);
              return client.send(
                new UpdateCommand({
                  TableName: "tweeter-follow-counts",
                  Key: { alias },
                  UpdateExpression:
                    "SET followee_count = :one, follower_count = if_not_exists(follower_count, :zero)",
                  ExpressionAttributeValues: {
                    ":zero": 0,
                    ":one": 1,
                  },
                })
              );
            }
            throw e;
          })
      );
    }
    await Promise.all(promises);
    if ((i + 25) % 1000 === 0) {
      console.log(`  Updated ${Math.min(i + 25, TOTAL_USERS)} follow counts`);
      await sleep(200);
    }
  }

  console.log("Population complete!");
  console.log(`  Total users: ${TOTAL_USERS + 1}`);
  console.log(`  @mainuser has ${TOTAL_USERS} followers`);
  console.log(`  Login with alias: @mainuser, password: ${PASSWORD}`);
}

populateUsers().catch(console.error);
