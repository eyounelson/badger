<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            [
                'name' => 'First Purchase',
                'icon' => '🎯',
                'required_purchases' => 1,
                'cashback_amount' => 300.00,
            ],
            [
                'name' => 'Early Adopter',
                'icon' => '⭐',
                'required_purchases' => 2,
                'cashback_amount' => 300.00,
            ],
            [
                'name' => 'Loyal Customer',
                'icon' => '💎',
                'required_purchases' => 4,
                'cashback_amount' => 300.00,
            ],
            [
                'name' => 'Big Spender',
                'icon' => '💰',
                'required_purchases' => 6,
                'cashback_amount' => 300.00,
            ],
            [
                'name' => 'Product Explorer',
                'icon' => '🔍',
                'required_purchases' => 8,
                'cashback_amount' => 300.00,
            ],
            [
                'name' => 'Shop Master',
                'icon' => '👑',
                'required_purchases' => 10,
                'cashback_amount' => 300.00,
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}
