use anchor_lang::prelude::*;

declare_id!("UX1v8GLw6dasAvnX9DF4BGNSrUb3bfWWn9ixNQ3dRPq");

#[program]
pub mod example {
    use super::*;

    pub fn unchecked_account(_ctx: Context<UncheckedAccountType>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UncheckedAccountType<'info> {
    /// CHECK: Explicit wrapper for AccountInfo type to emphasize that no checks are performed
    pub unchecked_account: UncheckedAccount<'info>,
}
