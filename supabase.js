const { createClient } = require("@supabase/supabase-js");


const supabase = createClient("https://abhmleehngupqjxbgsez.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaG1sZWVobmd1cHFqeGJnc2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYxOTMzNjYsImV4cCI6MjAyMTc2OTM2Nn0.HdBwhCEfdx4sMhysMRO2q9UGrOH8MEZR7IUWkK1bBEQ");

projectId = '7b92f53e-51ff-4430-bb2f-39ac71ef3f06'

// const getProject = async () => {
//     const table = await supabase
//     .from('Project')
//     .select().eq('id', projectId)
    
//     console.log("Data:", table);
// }

// getProject()

module.exports = { supabase };