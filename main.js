
/*---------------------------------------------------------------------------

    Filename: main.js
    Project:  CDR Log Import Extension
    (C) Copyright 2015, CarlBaccus.com LLC, All Rights Reserved.

    Summary:        Main start file for CDR Log Import extension
    REVISION: Version 1.4.4
	This revision allows a linking to another table that needs to be imported in the
	project called DeviceName with destDeviceName,Owner structure. 
	Then it matches Destination device owners name in ""Cleaned table that is output.
	 
    Developer(s):   Carl Baccus

---------------------------------------------------------------------------*/


include "tools_menu_inserter.js";
include "CDR_log_import_form.js";


if (Extension.isContextPackage())
{
    // if the script is packaged as an extension, when the
    // script is run, add a menu item to the host application 
    // and connect the menu item click event to a handler
    var item = insertToolsMenuItem("Import CDR Logs...");
    item.click.connect(onCDRLogImportMenuItemClicked);
}
 else
{
    // if the script is not packaged as an extension, when
    // the script is run, simply show the form
    var f = new CDRLogImportForm;
    f.center();
    f.show();
}

function onCDRLogImportMenuItemClicked()
{
    // if the menu item is clicked, show the form
    var f = new CDRLogImportForm;
    f.center();
    f.show();
}

// start the application event loop to process
// application events
Application.run();

