// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Menu, MenuItem, Submenu};

#[cfg(target_os = "linux")]
use std::{fs::metadata, path::PathBuf};
use std::process::Command;
#[cfg(target_os = "linux")]
use fork::{daemon, Fork}; // dep: fork = "0.1"

#[tauri::command]
fn show_in_folder(path: String) {
  #[cfg(target_os = "windows")]
  {
    Command::new("explorer")
        .args(["/select,", &path]) // The comma after select is not a typo
        .spawn()
        .unwrap();
  }

  #[cfg(target_os = "linux")]
  {
    if path.contains(",") {
      // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
      let new_path = match metadata(&path).unwrap().is_dir() {
        true => path,
        false => {
          let mut path2 = PathBuf::from(path);
          path2.pop();
          path2.into_os_string().into_string().unwrap()
        }
      };
      Command::new("xdg-open")
          .arg(&new_path)
          .spawn()
          .unwrap();
    } else {
      if let Ok(Fork::Child) = daemon(false, false) {
        Command::new("dbus-send")
            .args(["--session", "--dest=org.freedesktop.FileManager1", "--type=method_call",
                  "/org/freedesktop/FileManager1", "org.freedesktop.FileManager1.ShowItems",
                  format!("array:string:\"file://{path}\"").as_str(), "string:\"\""])
            .spawn()
            .unwrap();
      }
    }
  }

  #[cfg(target_os = "macos")]
  {
    Command::new("open")
        .args(["-R", &path])
        .spawn()
        .unwrap();
  }
}

fn main() {
    let app_menu = Submenu::new(
        "rms",
        Menu::new()
            .add_native_item(MenuItem::Minimize)
            .add_native_item(MenuItem::Quit),
    );
    let edit_menu = Submenu::new(
        "Edit",
        Menu::new()
            .add_native_item(MenuItem::Undo)
            .add_native_item(MenuItem::Redo)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Cut)
            .add_native_item(MenuItem::Copy)
            .add_native_item(MenuItem::Paste)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::SelectAll),
    );
    let menu = Menu::new().add_submenu(app_menu).add_submenu(edit_menu);
    tauri::Builder::default()
        .menu(menu)
        .invoke_handler(tauri::generate_handler![show_in_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
