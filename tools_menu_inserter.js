
/*---------------------------------------------------------------------------

    Filename: tools_menu_inserter.js
    Project:  CDR CDR
    (C) Copyright 2011, CarlBaccus.com LLC, All Rights Reserved.

    Summary:         Utility function for inserting CDRs into
                     the Tools menu in a consistent manner
     REVISION: Version 1.4.3
	This revision allows a linking to another table that needs to be imported in the
	project called DeviceName with destDeviceName,Owner structure. 
	Then it matches Destination device owners name in ""Cleaned table that is output.

    Developer(s):    Carl Baccus

---------------------------------------------------------------------------*/


function getToolsMenu()
{
    // function: getToolsMenu() : Object
    //
    // summary: returns the host application Tool menu item

    // get the host application's main menu
    var menu_bar = HostApp.getFrameMenu();
    var tools_menu;
    
    // get the Tool menu item; if it doesn't exist, create it
    var id = menu_bar.findMenu("Tools");
    if (id < 0)
    {
        tools_menu = new Menu("Tools");
        menu_bar.insert(tools_menu, menu_bar.getMenuCount()-1);
    }
     else
    {
        tools_menu = menu_bar.getMenu(id);
    }
    
    return tools_menu;
}

function insertToolsMenuItem(name)
{
    // function: insertToolsMenuItem(name : String)
    //
    // summary: inserts a menu item with the given name in an appropriate
    // location in the host application's Tool menu item

    // get the Tool menu item
    var tools_menu = getToolsMenu();
    
    // if the menu item already exists, first remove the
    // old menu item before we add the new menu item
    var item = tools_menu.findMenuItem(name);
    if (item)
        tools_menu.remove(item);
    
    // note: the 'click' event for this item must be connected
    // after this function is called
    item = new MenuItem(name);
    
    // the index of the separator right after the 'Projects...' menu item
    var projects_pos = tools_menu.findMenuItem("Projects...") + 1;
    
    // the index of the separator right before the 'Options...' menu item
    var options_pos = tools_menu.findMenuItem("Options...") - 1;
    
    // if we couldn't find one of the menu items, return
    if (projects_pos < 0 || options_pos < 0)
        return;
    
    // if these two menu items have the same index, we need to insert
    // another separator to make the 'CDRs Group'
    if (projects_pos == options_pos)
    {
        // this is the first CDR menu item that is being
        // inserted in the 'CDRs Group'
        tools_menu.insertSeparator(projects_pos++);
        tools_menu.insert(item, projects_pos);
    }
     else
    {
        // we've already created the 'CDRs Group', all we have
        // to do is insert the menu item at the end of the area
        tools_menu.insert(item, options_pos);
    }
    
    return item;
}

function cleanToolsMenu()
{
    // function: cleanToolsMenu()
    //
    // summary: removes menu items that have been added to the
    // Tool menu

    // get the Tool menu item
    var tools_menu = getToolsMenu();
    
    // the index of the separator right after the 'Projects...' menu item
    var projects_pos = tools_menu.findMenuItem("Projects...") + 1;
    
    // the index of the separator right before the 'Options...' menu item
    var options_pos = tools_menu.findMenuItem("Options...") - 1;
    
    // if we couldn't find one of the menu items, bail out
    if (projects_pos < 0 || options_pos < 0)
        return;
    
    // as we delete items, the menu item count will decrement as will
    // the index of the next item we want to delete, thus we don't want
    // to increment our delete index at all
    while (projects_pos != options_pos)
    {
        tools_menu.remove(projects_pos);
        options_pos = tools_menu.findMenuItem("Options...") - 1;
    }
}

