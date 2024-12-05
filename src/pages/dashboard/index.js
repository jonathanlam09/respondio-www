import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/auth';
import axios from 'axios';
import Modal from '../../components/modal';

const Dashboard = () => {
    const { user } = useAuthContext();
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState(null);
    const [note, setNote] = useState(null);
    const [show, setShow] = useState(false);
    const [count, setCount] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [overwrite, setOverwrite] = useState(0);

    const getNotes = async () => {
        try {
            const response = await axios.get(`/users/${user.id}/notes?length=1&count=${count}&overwrite=${overwrite}`);
            if(!response.data.status) {
                throw new Error(response.data.error);
            }
            if(response.data.loadMore == 1) {
                setLoadMore(true);
            } else {
                setLoadMore(false);
            }
            setLoading(false);
            setOverwrite(0);
            if(count === 1) {
                setNotes(response.data.notes);
            } else {
                setNotes((prev) => [...prev, ...response.data.notes])
            }
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    }

    const deleteNote = async (e) => {
        e.preventDefault();
        try {
            const target = e.currentTarget;
            const notesId = target.dataset.ref;
            const idx = target.dataset.idx;
            if(!notesId) {
                setError('Invalid note ID!');
                return false;
            }

            const response = await axios.delete(`/users/${user.id}/notes/${notesId}`);
            if(!response.data.status) {
                throw new Error(response.data.error);
            }

            notes.splice(idx, 1);
            setNotes([...notes]);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        getNotes();
    }, [count, overwrite]);

    return (
        <div className='container'>
            <div className='mt-5'>
                {
                    error && (
                        <div className='alert alert-danger'>{ error }</div>
                    )
                }
                <h3>Welcome back,</h3> 
                <h5>{user.firstName + ' ' + user.lastName}</h5>
                <div className='mt-5 d-flex justify-content-end'>
                    <button className='btn action-btn btn-sm text-white' 
                    onClick={() => {
                        setShow(true);
                    }}>NEW</button>
                    <button className='btn action-btn btn-sm text-white' 
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                        setCount(1);
                        setOverwrite(1);
                    }}>REFRESH</button>
                </div>
                <div className='mt-3 table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Type</th>
                                <th>Remarks</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                notes ? 
                                    (notes.length) > 0 ? 
                                        notes.map((note, idx) => {
                                            return (
                                                <tr data-ref={note.id} key={idx}>
                                                    <td>{ idx + 1}</td>
                                                    <td>{ note.type == 1 ? 'Work' : 'Personal' }</td>
                                                    <td>{ note.remarks }</td>
                                                    <td>
                                                        <button className='btn action-dt-btn btn-sm' onClick={(e) => {
                                                            setNote(note);
                                                            setShow(true);
                                                        }}>EDIT</button>
                                                        <button className='btn action-dt-btn btn-sm btn-danger text-white' style={{ marginLeft: '5px' }} onClick={deleteNote} data-ref={note.id} data-idx={idx}>DELETE</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    :
                                        <tr>
                                            <td colSpan={4} className='text-center'>No notes</td>
                                        </tr>
                                :
                                <tr>
                                    <td colSpan={4} className={'text-center'}>
                                        <div className='spinner spinner-border spinner-border-sm'></div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {
                        loadMore && (
                            <div className='row'>
                                <button className='btn btn-sm btn-block btn-primary action-btn' onClick={(e) => {
                                    setCount(count + 1);
                                    setLoading(true);
                                }}>
                                    LOAD MORE
                                    {
                                        loading && (
                                            <div className='spinner spinner-border spinner-border-sm' style={{ marginLeft: 5 }}></div>
                                        )
                                    }
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            <Modal show={show} setShow={setShow} note={note}/>
        </div>
    )
}

export default Dashboard