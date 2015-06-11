
/*---------------------------------------------------------------------------

    Filename: CDR_log_import_form.js
    Project:  CDR Log Import Extension
    (C) Copyright 2015, CarlBaccus.com LLC, All Rights Reserved.

    Summary:        Form for CDR Log Import extension
    REVISION: Version 1.4.4
	This revision allows a linking to another table that needs to be imported in the
	project called DeviceName with destDeviceName,Owner structure. 
	Then it matches Destination device owners name in ""Cleaned table that is output.
	Commented out experimental
	
    Developer(s):   Carl Baccus

---------------------------------------------------------------------------*/


include "CDR_log_import.js";


class CDRLogImportForm extends Form
{
    // class: CDRLogImportForm
    //
    // summary: top-level import form

    function CDRLogImportForm()
    {
        // function: CDRLogImportForm()
        //
        // summary: constructor function that defines the form
    
        // call the constructor on the base Form object
        super("CDR Log Import", 100, 100, 500, 440);
        this.setMinSize(500, 440);
        
        // create the input/output boxes
        m_source_listbox = new ListBox;
        m_output_textbox = new TextBox;
		m_search_textbox = new TextBox;
		
        
        // create output browse button
        var output_browse_button = new Button("Browse...");
        output_browse_button.click.connect(this, onOutputBrowseClicked);
        
        // create add button
        var add_button = new Button("Add...");
        add_button.click.connect(this, onAddClicked);
        
        // create remove button
        var remove_button = new Button("Remove");
        remove_button.click.connect(this, onRemoveClicked);

        // create run button
        var run_button = new Button("Run");
        run_button.click.connect(this, onRunClicked);
        
        // create cancel button
        var cancel_button = new Button("Cancel");
        cancel_button.click.connect(this, onCancelClicked);
        
        // create add/remove table layout
        var addremove_layout = new BoxLayout(Layout.Horizontal);
        addremove_layout.add(add_button, 0, Layout.Expand);
        addremove_layout.addSpacer(8);
        addremove_layout.add(remove_button, 0, Layout.Expand);   

//************************Experimental Start******************************

//		var checkbox1 = new CheckBox("Calling");

//************************Experimental End********************************/		
 
        
        // create output layout
        var output_layout = new BoxLayout(Layout.Horizontal);
        output_layout.add(new Label("Output Table:"), 0, Layout.Center);
        output_layout.addSpacer(5);
        output_layout.add(m_output_textbox, 1, Layout.Center);
        output_layout.addSpacer(8);
        //taking the browse button out for the time being
		//output_layout.add(output_browse_button, 0, Layout.Expand);
		output_layout.addStretchSpacer();
		output_layout.addSpacer(8);

//*********************************Experimental Start******************
//      var Label_explain_layout = new BoxLayout(Layout.Horizontal);
//		Label_explain_layout.add(new Label("Check 'Calling' to generate a table from the calling extension"), 0, Layout.Expand | Layout.Left | Layout.Right, 8);

//     // create search layout
//      var search_extension_layout = new BoxLayout(Layout.Horizontal);
//		search_extension_layout.add(new Label("Extension:"), 0, Layout.Center);
//      search_extension_layout.add(checkbox1, 0, Layout.Expand | Layout.Top | Layout.Bottom, 5);
//      search_extension_layout.add(m_search_textbox, 1, Layout.Right);
//      search_extension_layout.addSpacer(8);

//*********************************Experimental End******************/
		
       // create search layout
       /* var search_extension_layout = new BoxLayout(Layout.Horizontal);
        search_extension_layout.add(new Label("Search Extension:"), 0, Layout.Center);
        search_extension_layout.addSpacer(5);
        search_extension_layout.add(m_search_textbox, 1, Layout.Center);   *///removed because s_exten_lay above
        //search_extension_layout.addSpacer(8);
		//search_extension_layout.addStretchSpacer();
		
        // create button layout
        var button_layout = new BoxLayout(Layout.Horizontal);
        button_layout.addStretchSpacer();
        button_layout.add(run_button, 0, Layout.Expand);
        button_layout.addSpacer(8);         
        button_layout.add(cancel_button, 0, Layout.Expand);       
        
        // create main layout
        var main_layout = new BoxLayout(Layout.Vertical);
        main_layout.addSpacer(8);
        main_layout.add(new Label("Add the files you would like to import to the list below."), 0, Layout.Expand | Layout.Left | Layout.Right, 8);
        main_layout.addSpacer(8);
        main_layout.add(m_source_listbox, 1, Layout.Expand | Layout.Left | Layout.Right, 8);
        main_layout.addSpacer(8);
        main_layout.add(addremove_layout, 0, Layout.Expand | Layout.Left | Layout.Right, 8);
        main_layout.addSpacer(8);
        main_layout.add(output_layout, 0, Layout.Expand | Layout.Left | Layout.Right, 16);
        main_layout.addSpacer(8);
		main_layout.add(new Line(Line.Horizontal), 0, Layout.Expand);
        main_layout.addSpacer(8);
		//main_layout.add(Label_explain_layout, 0, Layout.Expand | Layout.Left | Layout.Right, 8);
       // main_layout.addSpacer(8);
		//main_layout.add(search_extension_layout, 0, Layout.Expand | Layout.Left | Layout.Right, 8);
        //main_layout.addSpacer(8);
		main_layout.add(new Line(Line.Horizontal), 0, Layout.Expand);
        main_layout.addSpacer(8);
        main_layout.add(button_layout, 0, Layout.Expand | Layout.Left | Layout.Right, 8);
        main_layout.addSpacer(8);
        
        // set the main layout for the form
        setLayout(main_layout);
		
//************************************Experimental Start*************************************

//		checkbox1.click.connect(this, onCheckBoxClicked);

//************************************Experimental End**************************************/
    }

    function onAddClicked()
    {
        // function: onAddClicked()
        //
        // summary:  when the add button is clicked, show a file dialog
        // and add any files that are selected
    
        var dlg = new FileDialog;
		
        if (dlg.showDialog() == DialogResult.Ok)
        {
            var files = dlg.getPaths();
            for (var i in files)
                m_source_listbox.addItem(files[i]);
        }  
    }

    function onRemoveClicked()
    {
        // function: onRemoveClicked()
        //
        // summary:  when the remove button is clicked, remove any
        // selected files from the import list
    
        // remove the selected items from the list to import
        var count = m_source_listbox.getItemCount();
        for (var i = count-1; i >= 0; --i)
        {
            if (m_source_listbox.getSelected(i))
                m_source_listbox.deleteItem(i);
        }
    }

    function onOutputBrowseClicked()
    {
        // function: onOutputBrowseClicked()
        //
        // summary: when the output browse button is clicked,
        // show a project file dialog
    
        var dlg = new ProjectFileDialog(ProjectFileDialog.Open);
        dlg.setCaption("Select Output Table");
        if (dlg.showDialog())
            m_output_textbox.setText(dlg.getPath());
    }
	
//***********************Experimental Start************************************************

//function onCheckBoxClicked(sender, event_args)
//{
//	//When a checkbox is clicked, out the label and check status to textbox
//	if (sender.getValue())
//		m_search_textbox.appendText(sender.getLabel() + "X");
//	else
//		m_search_textbox.appendText(sender.getLabel() + "O");

//	
//}

//***********************Experimental End*************************************************/

    function onRunClicked()
    {
        // function: onRunClicked()
        //
        // summary: when the run button is clicked, hide the
        // form and start the import process
    
        var output_path = m_output_textbox.getText();
        var file_count = m_source_listbox.getItemCount();
        var search_extension = m_search_textbox.getText();
		//var CllngD = checkbox1.getValue();
		
        // check to make sure the user has typed in an output table
        if (output_path.length == 0)
        {
            alert("Please enter a valid output table to continue.");
            return;
        }
        
        // check to make sure we're not overwriting an existing table
        var db = HostApp.getDatabase();
        if (db.exists(output_path))
        {
            var dlg_res = alert("The specified output table already exists.  Would you like to overwrite it?",
                                HostApp.getFrameCaption(),
                                DialogResult.YesNo);
                                
            if (dlg_res == DialogResult.No)
                return;
        }
        
        // hide the form
        this.show(false);
        
        // import each file in the source listbox
        var importer = new CDRLogImport;
        importer.setOutputTable(output_path);

        // import the files
        var files = new Array();
        var srch = search_extension;
        for (var i = 0; i < file_count; ++i)
        {
            files.push(m_source_listbox.getItem(i));
        }

        importer.importFiles(files,srch,CllngD);
        
        // refresh the project panel and open the output table
        if (db.exists(output_path))
        {
            HostApp.refresh();
            HostApp.open(output_path);
        }
        
        // close out
        close();
    }

    function onCancelClicked()
    {
        // function: onCancelClicked()
        //
        // summary: when the cancel button is clicked, either hide
        // the import form or exit the application, depending
        // on whether or not we are running as an extension
    
        // close out
        close();
    }
    
    function close()
    {
        // function: close()
        //
        // summary: close the application
    
        if (Extension.isContextPackage())
            this.show(false);
             else
            Application.exit();
    }

    // member variables
    var m_source_listbox;
    var m_output_textbox; 
	var m_search_textbox;
	var checkbox1;
	var CllngD;
}

