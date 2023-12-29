<?php

namespace Integration\ExchangeRates;

use App\Enum\Currencies;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExchangeRatesTest extends WebTestCase
{
    public function testReceivedData(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/exchange-rates?date=2023-12-27');
        $this->assertResponseIsSuccessful();
        $response = $client->getResponse();
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), TRUE);
        foreach ($responseData as $item) {
            $this->assertTrue(in_array($item['code'], Currencies::getCurrencies()));
        }
    }
}
