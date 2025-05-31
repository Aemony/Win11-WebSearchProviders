// WebSearchApp.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#define WIN32_LEAN_AND_MEAN
#include <string>
#include <wtypes.h>
#include <stdlib.h>
#include <shellapi.h>

// Main function
int APIENTRY wWinMain (_In_     HINSTANCE hInstance,
                       _In_opt_ HINSTANCE hPrevInstance,
                       _In_     LPWSTR    lpCmdLine,
                       _In_     int       nCmdShow)
{
  UNREFERENCED_PARAMETER (hInstance);
  UNREFERENCED_PARAMETER (hPrevInstance);
  UNREFERENCED_PARAMETER (lpCmdLine);
  UNREFERENCED_PARAMETER (nCmdShow);

  DWORD exitCode = ERROR_SUCCESS;

  SHELLEXECUTEINFOW
    sexi              = { };
    sexi.cbSize       = sizeof (SHELLEXECUTEINFOW);
    sexi.lpVerb       = L"OPEN";
    sexi.lpFile       = L"https://www.duckduckgo.com/";
    sexi.lpParameters = NULL;
    sexi.lpDirectory  = NULL;
    sexi.nShow        = SW_SHOWNORMAL;
    sexi.fMask        = SEE_MASK_FLAG_NO_UI   |
                        SEE_MASK_NOZONECHECKS |
                        SEE_MASK_NOASYNC; // SEE_MASK_NOASYNC is required to ensure we do not terminate our process before the web browser has launched

  if (! ShellExecuteExW (&sexi))
    exitCode = ERROR_INTERNAL_ERROR;

  return exitCode;
}