<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\User;
use App\Services\BadgeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BadgeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected BadgeService $badgeService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->badgeService = new BadgeService;
    }

    public function test_check_and_unlock_badges_unlocks_correct_badges_based_on_order_count(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(4)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $this->badgeService->checkAndUnlockBadges($user);

        $user->refresh()->load('badges');

        $this->assertCount(3, $user->badges);
        $this->assertTrue($user->badges->contains('name', 'First Purchase'));
        $this->assertTrue($user->badges->contains('name', 'Early Adopter'));
        $this->assertTrue($user->badges->contains('name', 'Loyal Customer'));
    }

    public function test_check_and_unlock_badges_doesnt_unlock_already_unlocked_badges(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(2)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $this->badgeService->checkAndUnlockBadges($user);

        $user->refresh()->load('badges');
        $initialCount = $user->badges->count();

        $this->badgeService->checkAndUnlockBadges($user);

        $user->refresh()->load('badges');

        $this->assertEquals($initialCount, $user->badges->count());
    }

    public function test_get_next_badge_info_returns_correct_next_badge_and_remaining(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(3)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $result = $this->badgeService->getNextBadgeInfo($user);

        $this->assertEquals('Loyal Customer', $result['next_badge']);
        $this->assertEquals(1, $result['remaining']);
    }

    public function test_get_next_badge_info_returns_null_when_user_has_all_badges(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(10)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $this->badgeService->checkAndUnlockBadges($user);

        $result = $this->badgeService->getNextBadgeInfo($user);

        $this->assertNull($result['next_badge']);
        $this->assertEquals(0, $result['remaining']);
    }

    public function test_get_available_badges_excludes_unlocked_badges(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(2)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $this->badgeService->checkAndUnlockBadges($user);

        $availableBadges = $this->badgeService->getAvailableBadges($user);

        $this->assertCount(4, $availableBadges);
        $this->assertFalse($availableBadges->contains('name', 'First Purchase'));
        $this->assertFalse($availableBadges->contains('name', 'Early Adopter'));
        $this->assertTrue($availableBadges->contains('name', 'Loyal Customer'));
    }

    public function test_get_available_badges_returns_badges_in_correct_order(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(2)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $this->badgeService->checkAndUnlockBadges($user);

        $availableBadges = $this->badgeService->getAvailableBadges($user);

        $badgeNames = $availableBadges->pluck('name')->toArray();

        $this->assertEquals('Loyal Customer', $badgeNames[0]);
        $this->assertEquals('Big Spender', $badgeNames[1]);
        $this->assertEquals('Product Explorer', $badgeNames[2]);
        $this->assertEquals('Shop Master', $badgeNames[3]);
    }
}
