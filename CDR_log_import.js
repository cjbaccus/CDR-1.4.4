
/*---------------------------------------------------------------------------

    Filename: CDR_log_import.js
    Project:  CDR Log Import Extension
    (C) Copyright 2011, CarlBaccus.com LLC, All Rights Reserved.

    Summary:        Engine for CDR Log Import extenion
	REVISION: Version 1.4.3
	This revision allows a linking to another table that needs to be imported in the
	project called DeviceName with destDeviceName,Owner structure. 
	Then it matches Destination device owners name in ""Cleaned table that is output.
	.2 version adds another table for search function to look up
	Calling instead of Called number.
	.3 is experimental adding another parameter to importFiles(files,srch,callGD)
	

	
    Developer(s):  Carl Baccus
					Frank Mazzeo
	
---------------------------------------------------------------------------*/


class CDRLogImport
{
    // class: CDRLogImport
    // 
    // summary: this class imports CDR access
    // logs into a database table
 
    function importFiles(files,srch,CllngD)
    {    
       
		alert("Hey "+ CllngD + " whatevs\n\n");
	   // function: importFiles(files : Array) : Boolean
        //
        // summary: imports the access logs from the input files; returns 
        // true if the files import successfully and false otherwise
		//alert("Hey " + srch + " there ");
        // if we don't have an output name, return false
        if (m_output.length == 0 || m_output == "/")
            return false;

        // if we don't have any input files, return false
        if (!files || files.length == 0)
            return false;

        // if a database isn't specified, use the host database
        if (!m_db)
            m_db = HostApp.getDatabase();

        // find out the total file size being imported
        var total_import_size = 0;
        for (var f in files)
        {
            var file_info = new FileInfo(files[f]);        
            total_import_size += file_info.getLength();
        }

        // create a new job to add to the job queue
        m_job = HostApp.createJob();
        m_job.setTitle("Importing CDR Logs");
        m_job.setMaximum(total_import_size);
        
        m_job.start();

        // create the table structure
        m_db.execute
        ("
            DROP TABLE IF EXISTS " + m_output + ";

            CREATE TABLE " + m_output + "
            (
                TimeOrigination VARCHAR(40),
                CallingNumber VARCHAR(40),
				OriginalCalledPartyNum VARCHAR(40),
                FinalCalledPartyNumber VARCHAR(40),
				Duration NUMERIC(8,0),
				origDeviceName VARCHAR(40),
				destDeviceName VARCHAR(40)
            );
        ");

        // import the files
        for (var f in files)
        {
            if (!processLogFile(files[f]))
                return false;
        }
		//This section here is to alter the table after the initial insert, and add the Dtime calculated field.
		m_db.execute
		("ALTER TABLE " + m_output + " ADD COLUMN Dtime DateTime AS DATE((TimeOrigination - 28800)* 1000)");
		
		//This will be to convert the duration field to an Hour:Minute:second format as a new calculated field called hms.
		m_db.execute
		("ALTER TABLE " + m_output + "
		ADD COLUMN hms Character(11)
		AS str(trunc(Duration/3600)) + \":\" + str(trunc(sum(Mod(Duration,3600)/60))) + \":\" + str(mod(mod(Duration,3600),60))");
		
		// this section will make a new table that will have cleaned results for just Calling number and the variable srch that was imported from the form 
		
		if (srch!="")
		{
		//First execute create new table
		m_db.execute
		("
			DROP TABLE IF EXISTS " + m_output + "DestDevice;
			
			CREATE TABLE " + m_output + "DestDevice
			(
				Dtime DateTime,
				CallingNumber VARCHAR(40),
				OriginalCalledPartyNum VARCHAR(40),
				FinalCalledPartyNumber VARCHAR(40),
				HMS VARCHAR(20),
				OWNER VARCHAR(40)
			);
		");

			//Now insert just what we want into new "m_output"Cleaned table.
			//Version 1.4.0 included data pulled in from a left join on DeviceName table
			//structure for csv file 'DeviceName' is: destDeviceName,Owner and must be placed in the project folder

			m_db.execute
			("
				INSERT INTO " + m_output + "DestDevice
				SELECT
				" + m_output + ".Dtime,
				" + m_output + ".CallingNumber,
				" + m_output + ".OriginalCalledPartyNum,
				" + m_output + ".FinalCalledPartyNumber,
				" + m_output + ".HMS,
				DeviceNames.Owner
				FROM " + m_output + " LEFT JOIN DeviceNames ON " + m_output + ".destDeviceName=DeviceNames.destDeviceName
				WHERE OriginalCalledPartyNum = \"" + srch + "\";
			");

		//This section adds a table for Original Called device
		m_db.execute
		("
			DROP TABLE IF EXISTS " + m_output + "OrigDevice;
			
			CREATE TABLE " + m_output + "OrigDevice
			(
				Dtime DateTime,
				CallingNumber VARCHAR(40),
				OriginalCalledPartyNum VARCHAR(40),
				FinalCalledPartyNumber VARCHAR(40),
				HMS VARCHAR(20),
				OWNER VARCHAR(40)
			);
		");
		
		//This section inputs data into new OrigDevice table and matches on DeviceNames table for owner
			m_db.execute
			("
				INSERT INTO " + m_output + "OrigDevice
				SELECT
				" + m_output + ".Dtime,
				" + m_output + ".CallingNumber,
				" + m_output + ".OriginalCalledPartyNum,
				" + m_output + ".FinalCalledPartyNumber,
				" + m_output + ".HMS,
				DeviceNames.Owner
				FROM " + m_output + " LEFT JOIN DeviceNames ON " + m_output + ".origDeviceName=DeviceNames.destDeviceName
				WHERE OriginalCalledPartyNum = \"" + srch + "\";
			");
			
			//This section adds a Calling table where CallingNumber
			//will be original Device, and Called will be Dest device
			m_db.execute
			("
				DROP TABLE IF EXISTS " + m_output + "Calling;
			
				CREATE TABLE " + m_output + "Calling
				(
					Dtime DateTime,
					CallingNumber VARCHAR(40),
					OriginalCalledPartyNum VARCHAR(40),
					FinalCalledPartyNumber VARCHAR(40),
					HMS VARCHAR(20),
					OWNER VARCHAR(40)
				);
			");
//*************************************Experimental Start***************************************************



//*************************************Experitmental End***************************************************/			
			//This section enters data into Calling table
			m_db.execute
			("
				INSERT INTO " + m_output + "Calling
				SELECT
				" + m_output + ".Dtime,
				" + m_output + ".CallingNumber,
				" + m_output + ".OriginalCalledPartyNum,
				" + m_output + ".FinalCalledPartyNumber,
				" + m_output + ".HMS,
				DeviceNames.Owner
				FROM " + m_output + " LEFT JOIN DeviceNames ON " + m_output + ".origDeviceName=DeviceNames.destDeviceName
				WHERE CallingNumber = \"" + srch + "\";
			");

			
			
		} else { alert("Nope no search string"); }
				
		
        // finish the import job
        if (m_job)
        {
            m_job.finish();
            m_job.setTitle("Importing CDR Logs");
        }

        return true;
    }

    function processLogFile(filename)
    {
        // function: processLogFile(filename : String) : Boolean
        //
        // summary: parses each line in the file specified by filename,
        // and appends the results to the output table; returns true
        // if the file is processed successfully, and false otherwise

        // if we don't have an output name, return false
        if (m_output.length == 0 || m_output == "/")
        {
            cancelImport();
            return false;
        }

        // update the job's title
        if (m_job)
            m_job.setTitle("Importing CDR Logs (" + filename + ")");

        // try to open the text file
        var reader = File.openText(filename);
        if (!reader)
        {
            cancelImport();
            return false;
        }
		// *******************Remember to add the fields here*******************
        // create a table inserter to insert the parsed values into the table
        var inserter = m_db.bulkInsert(m_output, "TimeOrigination, CallingNumber, OriginalCalledPartyNum, FinalCalledPartyNumber, Duration, origDeviceName, destDeviceName");
 
        // read all the files
        var line = reader.readLine();
        while (line)
        {
            // see if the job is cancelled; if it is, return false
            if (m_job.isCancelling())
            {
                m_job.cancel();
                return false;
            }


                //results = line.split("delimeter");
				var lineSplit = line.split(",");

		//lineSplit locations updated 9/1/2011 by Frank Mazzeo for CUCM ver 7.X+
		//Device fields set for originating and destination device.

            inserter[0] = lineSplit[4];                      // Date Time Origination
            inserter[1] = lineSplit[8];       		    	 // Calling Party
            inserter[2] = lineSplit[29];                     // Original Called Party
            inserter[3] = lineSplit[30];                     // Final Called Party
            inserter[4] = lineSplit[55];                     // Duration
			inserter[5] = lineSplit[56];                     // Originating Device Name
			inserter[6] = lineSplit[57];                     // Destination Device Name

			
            inserter.insertRow();

            line = reader.readLine();
            
            // increment the job status
            m_job.setValue(m_job.getValue() + line.length);
        }

        // close the file and finish the insert
        reader.close();
        inserter.finishInsert();
        
        return true;
    }

    function cancelImport()
    {
        // function: cancelImport()
        //
        // summary: cancels the import job

        if (m_job)
        {
            m_job.cancel();
            m_job.setTitle("Importing CDR Logs");
        }
    }

    function setDatabase(db)
    {
        // function: setDatabase(database : String)
        //
        // summary: sets the database to which to import the
        // access logs from the specified input connection
        // string

        m_db = db;
    }
    
    function setOutputTable(output)
    {
        // function: setOutputTable(output : String)
        //
        // summary: sets the output table to which to import
        // the access logs from the specified input path
    
        m_output = output;
    }


    // member variables
    var m_db;
    var m_job;
    var m_output;
	var search_extension;
}

