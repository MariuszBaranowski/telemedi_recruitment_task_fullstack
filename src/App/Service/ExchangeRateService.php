<?php

namespace App\Service;
use App\Enum\Currencies;
use App\Service\Interfaces\ExchangeRateService as IExchangeRateService;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExchangeRateService implements IExchangeRateService
{
    private $client;

    public function __construct(
        HttpClientInterface $client
    )
    {
        $this->client = $client;
    }

    public function getCurrenciesFromNBP(?string $date): ?string
    {
        if (!$date) {
            $date = date('Y-m-d');
        }

        $response = $this->client->request(
            'GET',
            "https://api.nbp.pl/api/exchangerates/tables/A/$date?format=json"
        );
        if ($response->getStatusCode() !== 200) {
            return null;
        }

        $rates = $this->getFilteredRates($response->toArray());

        return json_encode(
            $this->addBuyAndSellPrices($rates)
        );
    }

    private function getFilteredRates(array $rates): array
    {
        $currencies = Currencies::getCurrencies();

        return array_values(
            array_filter(
                $rates[0]['rates'],
                static function ($rate) use ($currencies) {
                    return in_array($rate['code'], $currencies);
                }
            )
        );
    }

    private function addBuyAndSellPrices(array $rates): array
    {
        return array_map(static function($rate) {
            $rate['sell'] = round($rate['mid'] + Currencies::getSellPriceMargin($rate['code']), 2);
            $rate['buy'] = Currencies::getBuyPriceMargin($rate['code']) !== 0.0
                ? round($rate['mid'] + Currencies::getBuyPriceMargin($rate['code']), 2)
                : 0;
            return $rate;
        }, $rates);
    }
}
