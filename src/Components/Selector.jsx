import React, {useState, useRef, useCallback} from 'react'
import useBookSearch from "./UseBookSearch";
import './Selector.css'


export default function Selector(props) {
    const [query, setQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [isOpen, setOpen] = useState('close-button')
    const [selectStyle, setSelectStyle] = useState('open-select select')

    const {
        books,
        hasMore,
        loading,
        error
    } = useBookSearch(query, pageNumber)

    const observer = useRef();
    const lastBookElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    function handleSearch(e) {
        setQuery(e.target.value);
        setPageNumber(1);
    }

    function handleClick(e) {
        props.getValue(e.target.innerHTML);
        //alert(e.target.innerHTML)
    }

    function handleEnter(e) {
        e.target.className = 'active'
    }

    function handleLeave(e) {
        e.target.className = 'non-active'
    }

    function changeOpen () {
        if (isOpen === 'open-button') {
            setSelectStyle('open-select select')
            setOpen('close-button');
        }
        else {
            setSelectStyle('close-select select')
            setOpen('open-button')
        }
    }

    useBookSearch(query, pageNumber)
    return (
        <div className={'main-selector'}>
            <div className={'main-input'}>
                <input type='text' onChange={handleSearch} className='input' placeholder={'Начните поиск'}></input>
                <div className={isOpen} onClick={changeOpen}/>
            </div>
            <div className={selectStyle}>
                {books.map((book, index) => {
                    if (books.length === index + 1) {
                        return <div ref={lastBookElementRef} key={book}>{book}</div>
                    } else {
                        return <div
                            onMouseEnter={handleEnter}
                            onMouseLeave={handleLeave}
                            onClick={handleClick}
                            className={'not-active'}
                            key={book}>{book}</div>
                    }
                })}
                <div>{loading && 'Loading..'}</div>
                <div>{error && 'Error'}</div>
            </div>
        </div>
    )
}
