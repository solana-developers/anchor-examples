use anchor_lang::prelude::*;

declare_id!("Becpenezy9fEQGqumtmfVBugQWDGkCAfV4Epd3jQQzJH");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Set the account discriminator
        let new_account = &mut ctx.accounts.new_account.load_init()?;
        msg!("Account data size: {}", new_account.data.len());
        Ok(())
    }

    pub fn update(ctx: Context<Update>, index: u16, input: u8, start: u16, end: u16) -> Result<()> {
        // Load the account to be updated
        let existing_account = &mut ctx.accounts.existing_account.load_mut()?;

        // Update the data at the specified index
        let index = index as usize;
        existing_account.data[index] = input;

        // Start and end index to slice account data, used for logging only in this example
        let data_len = existing_account.data.len();
        let start_index = start as usize;
        let end_index = (end as usize).min(data_len);

        // Get the data slice
        let data_slice = &existing_account.data[start_index..end_index];

        msg!("Account data size: {}", data_len);
        msg!("Updated data at index {}: {}", index, input);
        msg!(
            "Account data slice ({}..{}): {:?}",
            start_index,
            end_index,
            data_slice
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(zero)]
    pub new_account: AccountLoader<'info, DataAccount>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub existing_account: AccountLoader<'info, DataAccount>,
}

#[account(zero_copy)]
pub struct DataAccount {
    data: [u8; 10240],
}
