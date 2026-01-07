cmake_minimum_required(VERSION 3.16)

project(AbyssExplorer VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Find Qt packages
find_package(Qt6 REQUIRED COMPONENTS
    Core
    Gui
    Widgets
    WebEngineWidgets
    WebChannel
    Network
)

# Application sources
set(SOURCES
    src/main.cpp
    src/MainWindow.cpp
    src/MainWindow.h
    src/BrowserView.cpp
    src/BrowserView.h
    src/SystemTray.cpp
    src/SystemTray.h
    src/AbyssIDManager.cpp
    src/AbyssIDManager.h
    src/WalletBridge.cpp
    src/WalletBridge.h
    src/UpdateManager.cpp
    src/UpdateManager.h
)

# Resources
set(RESOURCES
    src/resources/resources.qrc
)

# Platform-specific configurations
if(WIN32)
    set(APP_ICON_RESOURCE_WINDOWS "${CMAKE_CURRENT_SOURCE_DIR}/src/resources/app.rc")
    add_executable(${PROJECT_NAME} WIN32 ${SOURCES} ${RESOURCES} ${APP_ICON_RESOURCE_WINDOWS})
elseif(APPLE)
    set(MACOSX_BUNDLE_ICON_FILE app.icns)
    set(APP_ICON_MACOSX "${CMAKE_CURRENT_SOURCE_DIR}/src/resources/icons/app.icns")
    set_source_files_properties(${APP_ICON_MACOSX} PROPERTIES MACOSX_PACKAGE_LOCATION "Resources")
    add_executable(${PROJECT_NAME} MACOSX_BUNDLE ${SOURCES} ${RESOURCES} ${APP_ICON_MACOSX})
    set_target_properties(${PROJECT_NAME} PROPERTIES
        MACOSX_BUNDLE_GUI_IDENTIFIER "cloud.demiurge.abyssexplorer"
        MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
        MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
        MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_SOURCE_DIR}/src/resources/Info.plist.in"
    )
else()
    add_executable(${PROJECT_NAME} ${SOURCES} ${RESOURCES})
endif()

# Link Qt libraries
target_link_libraries(${PROJECT_NAME} PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::WebEngineWidgets
    Qt6::WebChannel
    Qt6::Network
)

# Copy web content to build directory
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    "${CMAKE_CURRENT_SOURCE_DIR}/web"
    "$<TARGET_FILE_DIR:${PROJECT_NAME}>/web"
    COMMENT "Copying web content..."
)

# Version info
target_compile_definitions(${PROJECT_NAME} PRIVATE
    APP_VERSION="${PROJECT_VERSION}"
    APP_NAME="Abyss Explorer"
    APP_ORGANIZATION="Demiurge"
)

# Install rules
install(TARGETS ${PROJECT_NAME}
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
