import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'];
const MODES = ['Qty', 'Discount %', 'Price override', 'Delete'];

function Keypad({ activeMode, onModeChange }) {
  return (
    <Card className="flex h-full flex-col rounded-xl border-slate-800 bg-card">
      <CardHeader className="gap-1 border-b border-slate-800 p-5">
        <div>
          <p className="text-sm font-medium text-text-secondary">Keypad</p>
          <CardTitle className="mt-1 text-2xl font-semibold text-white">Numeric keypad</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 p-5">
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className="h-14 rounded-xl border border-slate-800 bg-background text-base font-semibold text-white transition hover:border-primary/30 hover:bg-slate-900"
            >
              {key}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {MODES.map((mode) => (
            <Button
              key={mode}
              type="button"
              variant={mode === 'Delete' ? 'destructive' : activeMode === mode ? 'secondary' : 'outline'}
              className="h-14 rounded-xl px-3 text-sm"
              onClick={() => onModeChange(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Keypad;