use anchor_lang::prelude::*;

declare_id!("8WkpXvDdMrGXPcjkKa8XFBBCkfamMtoxbLmBMG2bPx6N");

#[program]
mod client_string_input {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: String) -> Result<()> {
        ctx.accounts.new_account.data = data.to_string();
        msg!("{}",data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 32)]
    pub new_account: Account<'info, ClientInput>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ClientInput {
    data: String,
}
