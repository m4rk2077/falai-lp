export function Footer() {
  return (
    <footer className="py-8 pb-20 md:pb-8 px-4 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 opacity-60">
          <img src="/assets/icon-waveform.png" alt="" className="h-7" />
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-brand-mid to-brand-light bg-clip-text text-transparent">
            falai
          </span>
        </div>
        <p className="text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} FALAI. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
