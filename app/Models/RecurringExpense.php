<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['household_id', 'category_id', 'description', 'amount', 'currency', 'frequency', 'starts_at', 'last_generated_at', 'is_active'])]
class RecurringExpense extends Model
{
    protected function casts(): array
    {
        return [
            'amount'             => 'decimal:2',
            'starts_at'          => 'date',
            'last_generated_at'  => 'date',
            'is_active'          => 'boolean',
        ];
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
