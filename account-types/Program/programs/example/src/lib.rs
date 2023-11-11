use anchor_lang::prelude::*;
use anchor_spl::{metadata::Metadata, token::Token};

declare_id!("3mWQicZTYVUdMBx5dWV1g7ou7fVB3rqPbJXN9Br1SQoo");

#[program]
pub mod example {
    use super::*;

    pub fn program_accounts(_ctx: Context<ProgramAccounts>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProgramAccounts<'info> {
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, Metadata>,
}
