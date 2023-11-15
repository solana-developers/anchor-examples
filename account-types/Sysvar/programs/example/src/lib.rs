use anchor_lang::prelude::*;

declare_id!("r6um9QevZMPwVZDCpWf3WET3qeRrBfmdNhuHLEYWga1");

#[program]
pub mod example {
    use super::*;

    // There are various Sysvar Accounts, in this example we use the Sysvar Clock.
    pub fn sysvar_account(ctx: Context<SysvarAccount>) -> Result<()> {
        // Access the clock via the accounts struct.
        let clock = &ctx.accounts.sysvar_clock;
        msg!("Clock: {:?}", clock);

        // Alternatively, you can access the clock directly using `Clock::get()`
        // Recommended, saves transaction space.
        let clock = Clock::get()?;
        msg!("Clock: {:?}", clock);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SysvarAccount<'info> {
    pub sysvar_clock: Sysvar<'info, Clock>,
}
