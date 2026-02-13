import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://peqxcrjyqculzyxqaxsi.supabase.co";
const supabaseKey = "sb_publishable_ihkz_cTvvzTn5RXyfKnb5g_94CJU-hz";

export const supabase = createClient(supabaseURL, supabaseKey);
