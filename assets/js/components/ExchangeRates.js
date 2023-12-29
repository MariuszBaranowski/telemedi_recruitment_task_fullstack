// ./assets/js/components/ExchangeRates.js

import React, {Component} from 'react';
import axios from 'axios';

class ExchangeRates extends Component {
    constructor() {
        super();
        this.state = {
            rates: {},
            loading: true,
            date: (new Date()).toISOString().split('T')[0]
        };
    }

    getBaseUrl() {
        return 'http://telemedi-zadanie.localhost';
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const date = urlParams.get('date')
        if (date !== null) {
            this.state.date = date
        }

        this.fetchExchangeRates();
    }

    fetchExchangeRates() {
        const baseUrl = this.getBaseUrl();
        const date = this.state.date;
        axios.get( `${baseUrl}/api/exchange-rates?date=${date}`).then(response => {
            this.setState({
                rates: response.data,
                loading: false
            })
        }).catch(function (error) {
            console.error(error);
            this.setState({ rates: false, loading: false});
        });
    }

    changeDate = (event) => {
        const formattedDate = event.target.value;
        this.setState({date: formattedDate})
        window.history.replaceState(null, null, `?date=${formattedDate}`);
        this.fetchExchangeRates()
    }

    render() {
        const loading = this.state.loading;
        return(
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
                                        value={this.state.date}
                                        onChange={this.changeDate}
                                    />
                                </div>
                                {loading ? (
                                    <div className={'text-center'}>
                                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                                    </div>
                                ) : typeof this.state.rates === 'object' ? (
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
                                            {this.state.rates.map((currency) => (
                                                <tr key={currency.code}>
                                                    <th scope={'row'}>{currency.currency}</th>
                                                    <td>{currency.code}</td>
                                                    <td>{currency.buy !== 0 ? currency.buy : '-'}</td>
                                                    <td>{currency.sell !== 0 ? currency.sell : '-'}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : ( <div>Brak danych</div>)
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
export default ExchangeRates;
