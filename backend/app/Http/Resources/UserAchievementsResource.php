<?php

namespace App\Http\Resources;

use App\Models\Badge;
use App\Models\User;
use App\Services\BadgeService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property User $resource
 */
class UserAchievementsResource extends JsonResource
{
    public function __construct($resource, protected BadgeService $badgeService)
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        $this->resource->load('badges');
        $nextBadgeInfo = $this->badgeService->getNextBadgeInfo($this->resource);

        return [
            'unlocked_achievements' => $this->unlockedAchievements(),
            'next_available_achievements' => $this->nextAvailableAchievements(),
            'current_badge' => $this->resource->currentBadge()?->name,
            'next_badge' => $nextBadgeInfo['next_badge'],
            'remaining_to_unlock_next_badge' => $nextBadgeInfo['remaining'],
        ];
    }

    private function unlockedAchievements(): array
    {
        return $this->resource->badges
            ->map(fn ($badge) => [
                ...$this->baseBadgeData($badge),
                'unlocked_at' => Carbon::parse($badge->pivot->unlocked_at)->toIso8601String(),
            ])
            ->values()
            ->toArray();
    }

    private function nextAvailableAchievements(): array
    {
        $completedCount = $this->resource->completedOrdersCount();
        $availableBadges = $this->badgeService->getAvailableBadges($this->resource);

        return $availableBadges
            ->map(fn (Badge $badge) => [
                ...$this->baseBadgeData($badge),
                'progress' => [
                    'current' => $completedCount,
                    'required' => $badge->required_purchases,
                ],
            ])
            ->values()
            ->toArray();
    }

    private function baseBadgeData(Badge $badge): array
    {
        return [
            'name' => $badge->name,
            'icon' => $badge->icon,
            'required_purchases' => $badge->required_purchases,
        ];
    }
}
