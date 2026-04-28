<?php

namespace App\Console\Commands;

use App\Models\RecurringExpense;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

#[Signature('app:generate-recurring-transactions')]
#[Description('Generate transactions for active recurring expenses that are due today')]
class GenerateRecurringTransactions extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $today = Carbon::today();
        $generated = 0;

        RecurringExpense::with('household')
            ->where('is_active', true)
            ->where('starts_at', '<=', $today)
            ->each(function (RecurringExpense $expense) use ($today, &$generated) {
                if (! $this->isDue($expense, $today)) {
                    return;
                }

                $expense->household->transactions()->create([
                    'recurring_expense_id' => $expense->id,
                    'category_id'          => $expense->category_id,
                    'amount'               => $expense->amount,
                    'currency'             => $expense->currency,
                    'type'                 => 'expense',
                    'description'          => $expense->description,
                    'transacted_at'        => $today,
                ]);

                $expense->update(['last_generated_at' => $today]);
                $generated++;
            });

        $this->info("Generated {$generated} recurring transaction(s).");

        return self::SUCCESS;
    }

    private function isDue(RecurringExpense $expense, Carbon $today): bool
    {
        $last = $expense->last_generated_at;

        return match ($expense->frequency) {
            'daily'   => $last === null || ! $last->isToday(),
            'weekly'  => $last === null || $today->diffInDays($last) >= 7,
            'monthly' => $last === null || (
                $today->month !== $last->month || $today->year !== $last->year
            ),
            default   => false,
        };
    }
}
