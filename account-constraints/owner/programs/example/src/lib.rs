use anchor_lang::prelude::*;

declare_id!("6MGbxHhMb5QQUxqhe2R9ZLAKn99nsxcDiwwnbmAyMrK9");

#[program]
pub mod example {
    use super::*;

    pub fn owner_constraint(ctx: Context<OwnerConstraint>) -> Result<()> {
        msg!(
            "program owner: {}",
            ctx.accounts.program_owned_account.owner
        );
        Ok(())
    }

    pub fn owner_constraint2(ctx: Context<OwnerConstraint2>) -> Result<()> {
        msg!("program owner: {}", ctx.accounts.system_account.owner);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct OwnerConstraint<'info> {
    /// CHECK: owner constraint example, check current program is the owner
    #[account(owner = crate::ID)]
    pub program_owned_account: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct OwnerConstraint2<'info> {
    /// CHECK: owner constraint example, check owner is system program
    #[account(owner = system_program.key())]
    pub system_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
