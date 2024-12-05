import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/auth";

const Modal = ({ show, setShow, note }) => {
    const { user } = useAuthContext();
    const [remarks, setRemarks] = useState('');
    const [type, setType] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if(note) {
            setRemarks(note.remarks);
            setType(note.type);
        }
    }, [note]);

    const createNote = async () => {
        try {
            var formdata = new FormData();
            formdata.append('remarks', remarks);
            formdata.append('type', type);

            const response = await axios.post(`/users/${user.id}/notes`, formdata);
            if(!response.data.status) {
                throw new Error(response.data.error);
            }

            global.config.methods.successResponse('Successfully created note!')
            .then(() => {
                window.location.reload();
            })
        } catch (err) {
            setError(err.message);
        }
    }

    const updateNote = async () => {
        try {
            var formdata = new FormData();
            formdata.append('remarks', remarks);
            formdata.append('type', type);

            const response = await axios.patch(`/users/${user.id}/notes/${note.id}`, formdata);
            if(!response.data.status) {
                throw new Error(response.data.error);
            }

            global.config.methods.successResponse('Successfully updated note!')
            .then(() => {
                window.location.reload();
            })
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            {show && (
                <div className="modal-backdrop" >
                    <div className={`modal fade ${show ? "show d-block" : ""}`} 
                    tabIndex="-1"
                    role="dialog"
                    style={show ? { display: "block", opacity: 1 } : { display: "none" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{note ? 'EDIT NOTE' : 'NEW NOTE'}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setShow(false)
                                        }}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {
                                        error && (
                                            <div className='alert alert-danger'>{ error }</div>
                                        )
                                    }
                                    <div className="row">
                                        <div className="col-12">
                                            <select className={'form-control'} 
                                            style={{ border: '1px solid lightgrey' }} 
                                            onChange={(e) => {
                                                setType(e.target.value);
                                            }}
                                            value={type}>
                                                <option value={''}>Select type</option>
                                                <option value={1}>Work</option>
                                                <option value={2}>Personal</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <textarea className="form-control mt-3" style={{ border: '.1px solid lightgrey' }} onChange={(e) => {
                                                setRemarks(e.target.value)
                                            }} value={remarks}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={note ? updateNote : createNote}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;