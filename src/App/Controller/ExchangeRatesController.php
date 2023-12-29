<?php

declare(strict_types=1);

namespace App\Controller;

use App\Request\ExchangeRateRequest;
use App\Service\Interfaces\ExchangeRateService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ExchangeRatesController extends AbstractController
{
    public function index(Request $request, ExchangeRateService $service): Response
    {
        /**
         * TODO: that should be in Requests but required library is not installed so validation is manually here
         * TODO: this is not controller responsibility
         */
        $date = $request->get('date');

        if (
            $date
            && is_string($date)
            && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)
        ) {
            return new Response(
                'Date format is invalid',
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        return new Response(
            $service->getCurrenciesFromNBP($date),
            Response::HTTP_OK,
            ['Content-type' => 'application/json']
        );
    }
}
