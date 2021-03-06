import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch (query, pageNumber) {
    //используем хуки useState
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [empty, setEmpty] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    //очищаем прошлые значения, чтоыб не было "наслаивания"
    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);
        setEmpty(false);
        let cancel;
        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]
            })
            if (res.data.num_found === 0 && query) {
                setEmpty(true);
            }
            setHasMore(res.data.docs.length > 0);
            setLoading(false);
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true);
        })
        return () => cancel();
        }, [query, pageNumber]
    )
    return (
        { loading, error, books, hasMore, empty}
    )
}