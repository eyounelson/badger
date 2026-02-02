<?php

namespace App\Services;

use App\Events\BadgeUnlocked;
use App\Models\Badge;
use App\Models\User;
use Illuminate\Support\Collection;

class BadgeService
{
    public function checkAndUnlockBadges(User $user): void
    {
        $completedCount = $user->completedOrdersCount();

        $eligibleBadges = Badge::where('required_purchases', '<=', $completedCount)
            ->orderByDesc('required_purchases')
            ->get();

        $user->load('badges');

        foreach ($eligibleBadges as $badge) {
            if (! $user->badges->contains($badge->id)) {
                $user->badges()->attach($badge->id, ['unlocked_at' => now()]);
                event(new BadgeUnlocked($user, $badge));
            }
        }
    }

    public function getNextBadgeInfo(User $user): array
    {
        $completedCount = $user->completedOrdersCount();

        $nextBadge = Badge::where('required_purchases', '>', $completedCount)
            ->orderBy('required_purchases')
            ->first();

        if ($nextBadge) {
            return [
                'next_badge' => $nextBadge->name,
                'remaining' => $nextBadge->required_purchases - $completedCount,
            ];
        }

        return [
            'next_badge' => null,
            'remaining' => 0,
        ];
    }

    public function getAvailableBadges(User $user): Collection
    {
        $unlockedIds = $user->badges->pluck('id');

        return Badge::whereNotIn('id', $unlockedIds)
            ->orderBy('required_purchases')
            ->get();
    }
}
