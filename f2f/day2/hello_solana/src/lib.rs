use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};
use {
    borsh::BorshDeserialize, solana_program::program_error::ProgramError,
};
#[derive(BorshDeserialize, Debug)]
struct MoviePayload {
    variant: u8,
    title: String,
    rating: u8,
    description: String,
}

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    let payload = MoviePayload::try_from_slice(instruction_data).unwrap();
    msg!("Hello, The BLOKC Solana Developer Bootcamp");
    msg!("payload: {:?}", payload);
    Ok(())
}