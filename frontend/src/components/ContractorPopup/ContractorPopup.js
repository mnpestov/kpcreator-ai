import React, { useState, useEffect, useRef } from "react";
import { Input, Button } from '@skbkontur/react-ui';
import './ContractorPopup.css';

function ContractorPopup({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        companyName: "",
        phone: "",
        email: "",
    });

    const modalRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        function handleEscapeKey(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
        };
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.companyName.trim()) {
            alert("Поле 'Название / Имя' обязательно для заполнения!");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="popup-overlay">
            <div ref={modalRef} className="popup contractor-popup">
                <div className="contractor-popup__header">
                    <h2 className="form__title" style={{ margin: 0 }}>Добавить контрагента</h2>
                    <button className="popup__button_close" onClick={onClose}>×</button>
                </div>

                <div className="contractor-popup__body">
                    <div className="form__field">
                        <label htmlFor="companyName" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Название / Имя <span style={{color: 'red'}}>*</span>
                        </label>
                        <Input
                            id="companyName"
                            name="companyName"
                            data-testid="contractor-name-input"
                            value={formData.companyName}
                            onValueChange={value => handleChange({ target: { name: 'companyName', value } })}
                            width="100%"
                            placeholder="Например: ООО Ромашка"
                            autoFocus
                        />
                    </div>
                    <div className="form__field">
                        <label htmlFor="phone" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Телефон
                        </label>
                        <Input
                            id="phone"
                            name="phone"
                            data-testid="contractor-phone-input"
                            value={formData.phone}
                            onValueChange={value => handleChange({ target: { name: 'phone', value } })}
                            width="100%"
                            placeholder="+7 (999) 000-00-00"
                        />
                    </div>
                    <div className="form__field">
                        <label htmlFor="email" className="form__label" style={{ display: 'block', marginBottom: '8px' }}>
                            Email / Telegram
                        </label>
                        <Input
                            id="email"
                            name="email"
                            data-testid="contractor-email-input"
                            value={formData.email}
                            onValueChange={value => handleChange({ target: { name: 'email', value } })}
                            width="100%"
                            placeholder="mail@example.com или @username"
                        />
                    </div>
                </div>

                <div className="contractor-popup__footer">
                    <Button use="primary" data-testid="contractor-save-button" onClick={handleSave}>Сохранить</Button>
                    <Button use="default" onClick={onClose}>Отмена</Button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(ContractorPopup);
