import { useEffect, useRef, useState } from "react";
import "./homepage.css";
import axios from "axios";
import Loading from "../Loading/Loading";

const HomePage = () => {
    const clientID = "iFWVbJwIojH7cldmShqVaKbBm1gzQ3SKgxGyyszb22I";
    const [searchContent, setSearchContent] = useState("");
    const [page, setPage] = useState(1);
    const [listItem, setListItem] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    useEffect(() => {
        async function getData() {
            const res = await axios.get(`https://api.unsplash.com/search/photos?page=${page}&query=${searchContent}&per_page=12&client_id=${clientID}`)
            return res;
        }
        getData().then(res => {
            setListItem(prev => [...prev, ...res.data.results]);
        })
    }, [page, searchContent]);
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            setLoaded(true);
            setPage(prev => prev + 1);
        }
    }
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])
    const searchRef = useRef();
    const handleClickSearchBtn = () => {
        if (searchRef.current.value !== searchContent) {
            setListItem([]);
            setSearchContent(searchRef.current.value);
            setPage(1);
        }
    }
    return (
        <>
            <div className="search-container">
                <input ref={searchRef} type="text" className="search-text" placeholder="Search" />
                <button onClick={handleClickSearchBtn} className="search-btn">Search</button>
            </div>
            <div className="list-items">
                {listItem.length > 0 && listItem.map((card) => {
                    return (
                        <div key={card.id} className="item">
                            <img loading="lazy" src={card.urls.regular} alt=""/>
                        </div>
                    )
                })}
            </div>
            {isLoaded && <Loading />}
        </>
    );
}

export default HomePage;