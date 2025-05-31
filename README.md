# Win11-WebSearchProviders

Adds **Google** and **DuckDuckGo** as web search providers in Windows 11 for European Economic Area (EEA) devices (aka "EU devices").

*Note that link previews are currently not implemented.*

![win11-search](https://github.com/user-attachments/assets/a8677047-2e44-4c73-9e0f-7f97c53ac770)

## Requirements

* A device installed with Windows 11 in "EU mode". This is required because the [custom web search provider](https://learn.microsoft.com/en-us/windows/apps/develop/search/search-providers) functionality are only provided for such devices.

* [Developer Mode](https://learn.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development#activate-developer-mode) enabled, as this is required to sideload the application as it is signed with a self-signed certificate.

* Admin rights on the machine (required to install the self-signed certificate).


## Installation

1. [Download](https://github.com/Aemony/Win11-WebSearchProviders/releases/latest) `Win11-WebSearchProviders.zip` and extract it in a folder of your choice.

2. Run `setup.bat` or `setup.ps1`. Either of these will prompt for elevated rights (needed to install the self-signed certificate) before installing the `_package.msix` archive.

3. Once the app has been installed, type something in the Start Menu/Search in Windows and click on the `Google` or `DuckDuckGo` category on top.

   * You can also type `Google: test` or `DuckDuckGo: test` directly to search using the specified search engine.

4. Click a suggested search query to me taken directly to the search results of the selected search engine.

5. Web search providers can be disabled through the Settings app, under *Privacy & security* -> *Search permissions* -> **Web search**.

   * ![win11-settings-web_search](https://github.com/user-attachments/assets/c0960cd4-0e8e-4dd1-9fba-7419eb2c0f7a)


## Uninstall

Right click on `Google` or `DuckDuckGo` in the start menu and click **Uninstall**.


## Repository overview

* `cf_worker` - One half of the core of the whole project, this intermediate proxy runs as a free Cloudflare worker and facilitates communication between Windows 11 and the third-party search engine.

* `cpp` - A C++ Win32 desktop app whose sole purpose is to open the website of the search engine when launched. Added because MSIX packages apparently needed some launchable executable.

* `deploy` - All relevant files needed to create and install the package.

* `deploy\Source\AppxManifest.xml` - The other half of the core of the whole project, this defines the web search provider extensions and points Windows 11 towards the intermediate Cloudflare proxy worker.


## Interesting findings

* I was surprised to see that an application/package can seemingly install an unlimited amount of web search providers. This means we might have a "one package to rule them all" situation where a single application/package can install all of the most commonly used search engines in one go unto the system.

* Individual web search providers can be disabled under Settings -> Privacy & security -> Search permissions -> Web search ("Let search apps show results").

* The UI of the Search window is in need of some QoL polish when it comes to these types of third-party web search providers as various UX shortcuts are not supported (e.g. hitting Tab when having typed `Duck` to get it to auto-complete to `DuckDuckGo: ` does not work).

* This whole feature sees no support or use anywhere, probably because Microsoft only added it to adhere to EU laws and so only allows the functionality to be used on EU devices. But this also means that no third-party search engine supports the functionality out-of-the-box (to my knowledge), requiring the use of a intermediate proxy to facilitate traffic between the two.

* The Windows 11 API supports defining a custom protocol that can be used to open the search results in an application of the developer's choice. However interetingly enough, if *no* custom protocol is defined, then Windows 11 tries to use Edge (even if it is not installed) to open the results. Additionally, if the normal HTTP or HTTPS protocol is defined, nothing will work at all (or I guess it might open it in Edge, which I don't have installed). The only way to get Windows 11 to actually use the default web browser installed on the system is to use an invalid protocol that has not been registered on the system as this will force Windows to use the default web browser instead.

   * This is just annoying to deal with.
 
* Windows 11's built-in search functions through the [Microsoft Bing](https://apps.microsoft.com/detail/9nzbf4gt040c) app (formerly the "Web Search from Microsoft Bing" app). However Microsoft only allows this app to be uninstalled on EU devices. Oh, and this app enforces Microsoft Edge so if you have that browser uninstalled (again only available on EU devices), you will not even be able to use its search results.


## Privacy policy

As the solution is dependent on a Cloudflare worker acting as a proxy to facilitate communication between Windows 11 (Bing) and DuckDuckGo or Google, Cloudflare's worker is also collecting some diagnostics data from each connection made. This data is only retained for 3 days and only referenced if they are needed for troubleshooting purposes.


## License

All resources are licensed under MIT.
