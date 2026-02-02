<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BadgeApiTest extends TestCase
{
    use RefreshDatabase;

    public bool $seed = true;

    public function test_user_with_no_badges_returns_correct_empty_structure(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson("/api/users/$user->id/achievements");

        $response->assertStatus(200)
            ->assertJson([
                'unlocked_achievements' => [],
                'current_badge' => null,
                'next_badge' => 'First Purchase',
                'remaining_to_unlock_next_badge' => 1,
            ]);
    }

    public function test_user_with_unlocked_badges_returns_correct_data(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(2)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($user)->getJson("/api/users/$user->id/achievements");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'unlocked_achievements')
            ->assertJson([
                'current_badge' => 'Early Adopter',
                'next_badge' => 'Loyal Customer',
                'remaining_to_unlock_next_badge' => 2,
            ]);
    }

    public function test_response_includes_all_required_fields(): void
    {
        $user = User::factory()->create();

        Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($user)->getJson("/api/users/$user->id/achievements");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'unlocked_achievements' => [
                    '*' => ['name', 'icon', 'required_purchases', 'unlocked_at'],
                ],
                'next_available_achievements' => [
                    '*' => ['name', 'icon', 'required_purchases', 'progress' => ['current', 'required']],
                ],
                'current_badge',
                'next_badge',
                'remaining_to_unlock_next_badge',
            ]);
    }

    public function test_response_includes_next_available_badges_with_progress(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(2)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($user)->getJson("/api/users/{$user->id}/achievements");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'progress' => [
                    'current' => 2,
                    'required' => 4,
                ],
            ]);
    }

    public function test_remaining_count_is_accurate(): void
    {
        $user = User::factory()->create();

        Order::factory()->count(7)->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($user)->getJson("/api/users/$user->id/achievements");

        $response->assertStatus(200)
            ->assertJson([
                'next_badge' => 'Product Explorer',
                'remaining_to_unlock_next_badge' => 1,
            ]);
    }
}
