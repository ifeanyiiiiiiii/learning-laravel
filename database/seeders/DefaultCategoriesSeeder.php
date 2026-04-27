<?php

namespace Database\Seeders;

use App\Models\Household;

class DefaultCategoriesSeeder
{
    private const CATEGORIES = [
        // Income
        ['name' => 'Salary',             'type' => 'income',  'color' => '#10b981', 'icon' => 'briefcase'],
        ['name' => 'Business Income',    'type' => 'income',  'color' => '#06b6d4', 'icon' => 'store'],
        ['name' => 'Rental Income',      'type' => 'income',  'color' => '#8b5cf6', 'icon' => 'building-2'],
        ['name' => 'Investment Returns', 'type' => 'income',  'color' => '#f59e0b', 'icon' => 'trending-up'],

        // Expense
        ['name' => 'Groceries',          'type' => 'expense', 'color' => '#ef4444', 'icon' => 'shopping-cart'],
        ['name' => 'Rent / Mortgage',    'type' => 'expense', 'color' => '#f97316', 'icon' => 'home'],
        ['name' => 'Transport',          'type' => 'expense', 'color' => '#eab308', 'icon' => 'car'],
        ['name' => 'Utilities',          'type' => 'expense', 'color' => '#64748b', 'icon' => 'zap'],
        ['name' => 'School Fees',        'type' => 'expense', 'color' => '#3b82f6', 'icon' => 'graduation-cap'],
        ['name' => 'Healthcare',         'type' => 'expense', 'color' => '#ec4899', 'icon' => 'heart-pulse'],
        ['name' => 'Entertainment',      'type' => 'expense', 'color' => '#a855f7', 'icon' => 'tv-2'],
        ['name' => 'Clothing',           'type' => 'expense', 'color' => '#14b8a6', 'icon' => 'shirt'],
        ['name' => 'DSTV / Streaming',   'type' => 'expense', 'color' => '#0ea5e9', 'icon' => 'monitor-play'],
    ];

    public function seedFor(Household $household): void
    {
        $household->categories()->createMany(self::CATEGORIES);
    }
}
