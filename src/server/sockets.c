#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/tpyes.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORTNO 4000

void connect_to_socket(void (*handle) (int))
{
    int sockfd, newsockfd;
    socklen_t clilen;
    struct sockaddr_in serv_addr, cli_addr;

    sockfd = socket (AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        fprintf(stderr, "ERROR opening socket.\n");
        exit(1);
    }

    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family        = AF_INET;
    serv_addr.sin_addr.s_addr   = INADDR_ANY;
    serv_addr.sin_port          = htons (PORTNO);
    if (bind(sockfd, (struct sockaddr*) &serv_addr, sizeof(serv_addr)) < 0) {
        fprintf(stderr, "ERROR binding socket.\n");
        exit(1);
    }

    listen(sockfd, 5);

    while(1) {
        clilen      = sizeof(cli_addr);
        newsockfd   = accept(sockfd, (struct sockaddr*) &cli_addr, &clilen);
        if (newsockfd < 0) {
            fprintf(stderr, "ERROR on accept/\n");
        } else {
            handle(newsockfd);
        }
    }
}
