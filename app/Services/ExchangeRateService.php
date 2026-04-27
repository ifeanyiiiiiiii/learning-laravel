<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExchangeRateService
{
    /**
     * Fallback rate used when the API is unreachable.
     * NGN per 1 USD.
     */
    private const FALLBACK_NGN_PER_USD = 1600.00;

    /**
     * Cache the rate for 1 hour to avoid hitting the API on every page load.
     */
    private const CACHE_TTL_SECONDS = 3600;

    /**
     * Get the current NGN per 1 USD rate.
     */
    public function ngnPerUsd(): float
    {
        return Cache::remember('exchange_rate.NGN_per_USD', self::CACHE_TTL_SECONDS, function () {
            return $this->fetchFromApi();
        });
    }

    /**
     * Convert an amount between NGN and USD.
     */
    public function convert(float $amount, string $from, string $to): float
    {
        if ($from === $to) {
            return $amount;
        }

        $rate = $this->ngnPerUsd();

        return $from === 'USD'
            ? round($amount * $rate, 2)   // USD → NGN
            : round($amount / $rate, 2);  // NGN → USD
    }

    private function fetchFromApi(): float
    {
        $key = config('services.exchange_rate.key');

        try {
            $response = Http::timeout(5)
                ->get("https://v6.exchangerate-api.com/v6/{$key}/latest/USD");

            if ($response->successful()) {
                $rate = $response->json('conversion_rates.NGN');

                if (is_numeric($rate) && $rate > 0) {
                    return (float) $rate;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('ExchangeRateService: API call failed, using fallback rate.', [
                'error' => $e->getMessage(),
            ]);
        }

        return self::FALLBACK_NGN_PER_USD;
    }
}
