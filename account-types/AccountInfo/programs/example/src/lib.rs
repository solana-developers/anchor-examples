use anchor_lang::prelude::*;

declare_id!("C8TvCQRgnq3QCF1E22WMKuJCbAKYS2aD5TijNxRU7uZb");

#[program]
pub mod example {
    use super::*;

    pub fn account_info(_ctx: Context<AccountInfoType>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AccountInfoType<'info> {
    /// CHECK: AccountInfo is an unchecked account, any account can be passed in
    pub unchecked_account: AccountInfo<'info>,
}
