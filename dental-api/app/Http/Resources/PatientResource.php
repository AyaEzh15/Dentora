<?php

namespace App\Http\Resources;

use App\Enums\AppointmentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Patient */
class PatientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $lastVisit = null;
        $nextAppointment = null;

        if ($this->relationLoaded('appointments')) {
            $lastVisit = $this->appointments
                ->where('status', AppointmentStatus::COMPLETED)
                ->sortByDesc('start_at')
                ->first();

            $nextAppointment = $this->appointments
                ->whereIn('status', [
                    AppointmentStatus::PENDING,
                    AppointmentStatus::CONFIRMED,
                    AppointmentStatus::IN_PROGRESS,
                ])
                ->where('start_at', '>=', now())
                ->sortBy('start_at')
                ->first();
        }

        return [
            'id' => $this->id,
            'fileNumber' => $this->file_number,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'dateOfBirth' => $this->date_of_birth?->toDateString(),
            'age' => $this->age,
            'gender' => $this->gender?->value,
            'genderLabel' => $this->gender?->label(),
            'cin' => $this->cin,
            'address' => $this->address,
            'city' => $this->city,
            'medicalAlert' => $this->medical_alert,
            'notes' => $this->notes,
            'isActive' => $this->is_active,
            'lastVisitAt' => $lastVisit?->start_at?->toIso8601String(),
            'nextAppointmentAt' => $nextAppointment?->start_at?->toIso8601String(),
            'appointments' => $this->when(
                $request->routeIs('patients.show'),
                fn () => AppointmentResource::collection($this->whenLoaded('appointments'))
            ),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
