<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['household_id', 'category_id', 'amount', 'currency', 'type', 'description', 'transacted_at'])]
class Transaction extends Model
{
    protected function casts(): array
    {
        return [
            'amount'         => 'decimal:2',
            'transacted_at'  => 'date',
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
}
