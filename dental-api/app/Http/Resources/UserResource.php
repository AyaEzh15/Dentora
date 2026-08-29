<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatarPath' => $this->avatar_path,
            'isActive' => $this->is_active,
            'clinicId' => $this->clinic_id,
            'roles' => $this->whenLoaded('roles', fn () => $this->getRoleNames()->values()),
            'role' => $this->whenLoaded('roles', fn () => $this->getRoleNames()->first()),
            'lastLoginAt' => $this->last_login_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
