#include "connect.h"
#include <iostream>
#include <unistd.h>

using namespace std;

static void handle (int);

int main (int argc, char** argv)
{
    connect_to_socket (handle);
    return 0;
}

static void handle (int sock)
{
    cout << "SOCKET " << sock << endl;
    close (sock);
}
