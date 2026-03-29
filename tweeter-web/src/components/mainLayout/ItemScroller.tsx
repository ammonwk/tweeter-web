import { PagedItemView, PagedPresenter } from "../../presenters/PagedPresenter";
import { useEffect, useRef, useState } from "react";
import { useMessageActions } from "../toaster/hooks";
import { useUserInfo } from "../userInfo/hooks";
import { ToastType } from "../toaster/Toast";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props<T, U> {
    presenterGenerator: (view: PagedItemView<T>) => PagedPresenter<T, U>;
    itemComponentGenerator: (item: T, index: number) => JSX.Element;
    featurePath: string;
}

const ItemScroller = <T, U>(props: Props<T, U>) => {
    const { displayToast } = useMessageActions();
    const [items, setItems] = useState<T[]>([]);
    const { authToken, displayedUser } = useUserInfo();
    
    const presenterRef = useRef(
        props.presenterGenerator({
            addItems: (newItems) => setItems((previousItems) => [...previousItems, ...newItems]),
            displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
        })
    )
    
    useEffect(() => {
        presenterRef.current = props.presenterGenerator({
            addItems: (newItems) => setItems((previousItems) => [...previousItems, ...newItems]),
            displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
        });
    }, [props.presenterGenerator]);
    
    useEffect(() => {
        presenterRef.current.reset();
        presenterRef.current.loadMoreItems(authToken!, displayedUser!.alias!);
        setItems([]);
    }, [displayedUser]);
    
    return (
        <div className="container px-0 overflow-visible vh-100">
        <InfiniteScroll
            className="pr-0 mr-0"
            dataLength={items.length}
            next={() => presenterRef.current.loadMoreItems(authToken!, displayedUser!.alias!)}
            hasMore={presenterRef.current.hasMoreItems}
            loader={<h4>Loading...</h4>}
        >
            {items.map((item, index) => (
            <div
                key={index}
                className="row mb-3 mx-0 px-0 border rounded bg-white"
            >
                {props.itemComponentGenerator(item, index)}
            </div>
            ))}
        </InfiniteScroll>
        </div>
    );
};

export default ItemScroller;
