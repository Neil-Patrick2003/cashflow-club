/** The landing page's lockup, sized for the sidebar rail. */
export default function AppLogo() {
    return (
        <>
            <img
                src="/cashflow-logo-96.png"
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 group-data-[collapsible=icon]:size-8"
            />
            <div className="grid flex-1 text-left leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-gold-400 text-[0.625rem] font-bold tracking-[0.22em] uppercase">
                    Philippine
                </span>
                <span className="font-display mt-1 truncate text-lg leading-none font-extrabold tracking-wide text-white uppercase">
                    Cashflow Club
                </span>
            </div>
        </>
    );
}
