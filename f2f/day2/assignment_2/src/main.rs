fn main() {
    println!("{}", "Bootcamp!".to_lowercase().chars().filter(|c| "bcdfghjklmnpqrstvwxyz".contains(*c)).count());
    
}
 