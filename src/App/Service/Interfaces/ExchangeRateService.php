<?php

namespace App\Service\Interfaces;

interface ExchangeRateService
{
    public function getCurrenciesFromNBP(?string $date): ?string;
}
