<?php

namespace App\Request;

use Symfony\Component\Validator\Constraints as Assert;

class ExchangeRateRequest
{
    public function __construct()
    {
    }

    /**
     * @Assert\Date
     * @Assert\Type("\Date")
     */
    protected $date;
}
