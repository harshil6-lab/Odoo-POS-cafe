import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'];
const MODES = ['Qty', 'Discount %', 'Price override', 'Delete'];

function Keypad({ activeMode, onModeChange }) {
  return (
    <Card className="flex h-full flex-col rounded-[28px] border-white/10 bg-[#111827]">
      <CardHeader className="gap-1 border-b border-white/10 p-5">
        <div>
          <p className="text-sm font-medium text-slate-400">Keypad</p>
          <CardTitle className="mt-1 text-2xl font-semibold text-slate-100">Numeric keypad</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 p-5">
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className="h-14 rounded-2xl border border-white/10 bg-[#0B1220] text-base font-semibold text-slate-100 transition hover:border-teal-400/30 hover:bg-slate-900"
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
              className="h-14 rounded-2xl px-3 text-sm"
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