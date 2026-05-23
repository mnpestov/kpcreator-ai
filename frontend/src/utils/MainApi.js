import { API_BASE_URL } from './const';

class Api {
    constructor({ baseUrl }) {
        this._baseUrl = baseUrl;
    }
    
    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    }
    getKp(number) {
        return fetch(`${this._baseUrl}/kp/${number}`, {
            headers: {}
        })
            .then(this._checkResponse)
    }

    getLastKps() {
        return fetch(`${this._baseUrl}/kp/latest`, { method: 'GET' })
            .then(this._checkResponse);
    }

    getLastKpNumber() {
        return fetch(`${this._baseUrl}/kp/lastKpNumber`, {
            headers: {}
        })
            .then(this._checkResponse)
    }
    addKp(kp) {
        return fetch(`${this._baseUrl}/kp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(kp)
        })
            .then(this._checkResponse);
    }

    updateKp(formData, kpNumber) {
        return fetch(`${this._baseUrl}/kp/${kpNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(this._checkResponse);
    }

    deleteKp(id) {
        return fetch(`${this._baseUrl}/kp/${id}`, {
            method: 'DELETE'
        }).then(this._checkResponse);
    }

    addList(list) {
        return fetch(`${this._baseUrl}/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list)
        })
            .then(this._checkResponse);
    }
    addRow(row) {
        return fetch(`${this._baseUrl}/row`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(row)
        })
            .then(this._checkResponse);
    }
    deleteList(id) {
        return fetch(`${this._baseUrl}/list/${id}`, {
            method: 'DELETE',
            headers: {},
        })
            .then(this._checkResponse);
    }
    deleteRow(id) {
        return fetch(`${this._baseUrl}/row/${id}`, {
            method: 'DELETE',
            headers: {},
        })
            .then(this._checkResponse);
    }
    updateRow(row) {
        return fetch(`${this._baseUrl}/row/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(row)
        })
            .then(this._checkResponse);
    }

    getUser() {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/profile/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(this._checkResponse)
    }

    getContractors(search = '') {
        const token = localStorage.getItem('authToken');
        const url = search 
            ? `${this._baseUrl}/contractors?search=${encodeURIComponent(search)}`
            : `${this._baseUrl}/contractors`;
        return fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(this._checkResponse);
    }

    getContractor(id) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/contractors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(this._checkResponse);
    }

    createContractor(contractorData) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/contractors`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contractorData)
        })
            .then(this._checkResponse);
    }

    updateContractor(id, contractorData) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/contractors/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contractorData)
        })
            .then(this._checkResponse);
    }

    deleteContractor(id) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/contractors/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(this._checkResponse);
    }

    getEvents(search = '') {
        const token = localStorage.getItem('authToken');
        const url = search
            ? `${this._baseUrl}/events?search=${encodeURIComponent(search)}`
            : `${this._baseUrl}/events`;
        return fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(this._checkResponse);
    }

    getOneEvent(id) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/events/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(this._checkResponse);
    }

    createEvent(eventData) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/events`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        })
            .then(this._checkResponse);
    }

    updateEvent(id, eventData) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/events/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        })
            .then(this._checkResponse);
    }

    deleteEvent(id) {
        const token = localStorage.getItem('authToken');
        return fetch(`${this._baseUrl}/events/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(this._checkResponse);
    }

}
// const API_BASE =
//   (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.replace(/\/$/, ''))
//   || (typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api');

// export const MainApi = new Api({
//   baseUrl: API_BASE,
// });
export const MainApi = new Api({
    baseUrl: API_BASE_URL,
    // baseUrl: 'https://kurgi-kp-backend.onrender.com',
});