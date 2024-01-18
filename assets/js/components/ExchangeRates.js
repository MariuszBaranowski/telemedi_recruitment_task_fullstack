import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExchangeRates = () => {
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState((new Date()).toISOString().split('T')[0]);
    const [calculateValue, setCalculateValue] = useState('');
    const [calculateBuy, setCalculateBuy] = useState(-1);
    const [calculateSell, setCalculateSell] = useState(-1);
    const [calculateExchange, setCalculateExchange] = useState('');
    const [calculateCode, setCalculateCode] = useState('');

    const getBaseUrl = () => 'http://telemedi-zadanie.localhost';

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');
        if (dateParam !== null) {
            setDate(dateParam);
        }
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        recalculate();
        recalculateCode();
    }, [calculateValue, calculateBuy, calculateSell, rates]);

    const fetchExchangeRates = () => {
        const baseUrl = getBaseUrl();
        axios.get(`${baseUrl}/api/exchange-rates?date=${date}`).then(response => {
            setRates(response.data);
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setRates(false);
            setLoading(false);
        });
    };

    const changeDate = (event) => {
        const formattedDate = event.target.value;
        setDate(formattedDate);
        window.history.replaceState(null, null, `?date=${formattedDate}`);
        fetchExchangeRates();
    };

    const setExchangeValue = (event) => {
        setCalculateValue(event.target.value);
    };

    const setExchangeSell = (event) => {
        setCalculateSell(event.target.value);
    };

    const setExchangeBuy = (event) => {
        setCalculateBuy(event.target.value);
    };

    const recalculate = () => {
        if (Number(calculateValue) < 0 || calculateSell === -1 || calculateBuy === -1) {
            return;
        }

        if (rates[calculateBuy].buy === 0) {
            setCalculateExchange('Kantor nie prowadzi sprzedaży tej waluty')
            setCalculateCode('')
            return;
        }

        const sellCalc = rates[calculateSell].sell * Number(calculateValue);
        const buyCalc = sellCalc / rates[calculateBuy].buy;

        setCalculateExchange(
            Math.round(buyCalc * 100) / 100
        );
    };

    const recalculateCode = () => {
        if (calculateBuy === -1) {
            return;
        }
        setCalculateCode(rates[calculateBuy].code);
    };

    return (
        <div>
            <section className="row-section">
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-8 offset-md-2">
                            <div className={'m-3 input-group'}>
                                <label htmlFor="dateInput" className={'my-auto mx-2'}>Kursy walut z dnia</label>
                                <input
                                    type="date"
                                    id="dateInput"
                                    className={'form-control'}
                                    value={date}
                                    onChange={changeDate}
                                />
                            </div>
                            {loading ? (
                                <div className={'text-center'}>
                                    <span className="fa fa-spin fa-spinner fa-4x"></span>
                                </div>
                            ) : typeof rates === 'object' ? (
                                <div>
                                    <table className={'table table-hover'}>
                                        <thead>
                                        <tr>
                                            <th scope={'col'}>Waluta</th>
                                            <th scope={'col'}>Kod waluty</th>
                                            <th scope={'col'}>Zakup</th>
                                            <th scope={'col'}>Sprzedaż</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {Object.values(rates).map((currency) => (
                                            <tr key={currency.code}>
                                                <th scope={'row'}>{currency.currency}</th>
                                                <td>{currency.code}</td>
                                                <td>{currency.buy !== 0 ? currency.buy : '-'}</td>
                                                <td>{currency.sell !== 0 ? currency.sell : '-'}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    <div>
                                        <span className={'text-center m-4 h2'}>Kalkulator walut</span>
                                        <div className={'form-group'}>
                                            <div className={'form-group row'}>
                                                <label htmlFor="calculateValue"
                                                       className={'my-auto mx-2'}>Wartość:</label>
                                                <input type='number' id='calculateValue'
                                                       value={calculateValue} className={'form-control'}
                                                       onChange={setExchangeValue}/>
                                            </div>
                                            <div className={'form-group row'}>
                                                <label htmlFor="calculateSell" className={'my-auto mx-2'}>Sprzedaję:</label>
                                                <select id='calculateSell' value={calculateSell}
                                                        className={'form-control'} onChange={setExchangeSell}>
                                                    <option value={-1}>-</option>
                                                    {Object.values(rates).map((currency, key) => (
                                                        <option key={currency.code}
                                                                value={key}>{currency.currency}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={'form-group row'}>
                                                <label htmlFor="calculateBuy" className={'my-auto mx-2'}>Kupuję:</label>
                                                <select id='calculateBuy' value={calculateBuy}
                                                        className={'form-control'} onChange={setExchangeBuy}>
                                                    <option value={-1}>-</option>
                                                    {Object.values(rates).map((currency, key) => (
                                                        <option key={currency.code}
                                                                value={key}>{currency.currency}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <span>Wartość wymiany: {calculateExchange} {calculateCode}</span>
                                        </div>
                                        <span className={'text-muted'}>* Obliczenia kalkulatora mają charakter informacyjny</span>
                                    </div>
                                </div>
                            ) : ( <div>Brak danych</div>)
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default ExchangeRates;
