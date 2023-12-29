<?php

namespace App\Enum;

/** TODO: replace class to enum at PHP 8.2 **/
class Currencies
{
    public const USD = 'USD';
    public const EUR = 'EUR';
    public const CZK = 'CZK';
    public const IDR = 'IDR';
    public const BRL = 'BRL';

    public static function getCurrencies(): array {
        return [
            self::USD,
            self::EUR,
            self::CZK,
            self::IDR,
            self::BRL,
        ];
    }

    public static function getBuyPriceMargin(string $code): float {
        switch($code) {
            case self::EUR:
            case self::USD:
                return 0.05;
            default:
                return 0.0;
        }
    }

    public static function getSellPriceMargin(string $code): float {
        switch($code) {
            case self::EUR:
            case self::USD:
                return 0.07;
            default:
                return 0.15;
        }
    }
}
